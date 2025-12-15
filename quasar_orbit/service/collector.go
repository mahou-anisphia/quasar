package service

import (
	"fmt"
	"time"

	"github.com/shirou/gopsutil/v4/cpu"
	"github.com/shirou/gopsutil/v4/disk"
	"github.com/shirou/gopsutil/v4/host"
	"github.com/shirou/gopsutil/v4/mem"
)

type StaticHardware struct {
	ServerName          string
	TotalCPU            int
	TotalRAM            int64 // Bytes
	TotalPhysicalRAMBar int
	TotalDiskSpace      int64 // Bytes
	TotalDiskDrive      int
}

type Telemetry struct {
	DiskUsagePercentage float64
	Uptime              uint64  // Seconds
	CpuUsagePercentage  float64 // CPU usage percentage (cross-platform)
	RamUsagePercentage  float64
	SwapUsedBytes       int64 // Bytes used
}

// DetectHardware detects hardware specs, using provided fallbacks if detection fails
func DetectHardware(fallback *StaticHardware) (*StaticHardware, error) {
	hw := &StaticHardware{
		ServerName:          fallback.ServerName,
		TotalPhysicalRAMBar: fallback.TotalPhysicalRAMBar,
		TotalDiskDrive:      fallback.TotalDiskDrive,
	}

	// Try to detect CPU count, use fallback if it fails
	cpuCount, err := cpu.Counts(true)
	if err != nil || cpuCount == 0 {
		hw.TotalCPU = fallback.TotalCPU
	} else {
		hw.TotalCPU = cpuCount
	}

	// Try to detect RAM, use fallback if it fails
	vmStat, err := mem.VirtualMemory()
	if err != nil || vmStat.Total == 0 {
		if fallback.TotalRAM == 0 {
			return nil, fmt.Errorf("failed to detect RAM and no fallback value provided")
		}
		hw.TotalRAM = fallback.TotalRAM
	} else {
		hw.TotalRAM = int64(vmStat.Total)
	}

	// Try to detect disk space, use fallback if it fails
	totalDisk, err := getTotalDiskSpace()
	if err != nil || totalDisk == 0 {
		if fallback.TotalDiskSpace == 0 {
			return nil, fmt.Errorf("failed to detect disk space and no fallback value provided")
		}
		hw.TotalDiskSpace = fallback.TotalDiskSpace
	} else {
		hw.TotalDiskSpace = totalDisk
	}

	return hw, nil
}

func getTotalDiskSpace() (int64, error) {
	partitions, err := disk.Partitions(false)
	if err != nil {
		return 0, err
	}

	var totalSpace int64
	seen := make(map[string]bool)

	for _, partition := range partitions {
		// Skip duplicate devices (same physical disk mounted multiple times)
		if seen[partition.Device] {
			continue
		}
		seen[partition.Device] = true

		usage, err := disk.Usage(partition.Mountpoint)
		if err != nil {
			continue // Skip partitions we can't access
		}

		totalSpace += int64(usage.Total)
	}

	if totalSpace == 0 {
		return 0, fmt.Errorf("no accessible disk partitions found")
	}

	return totalSpace, nil
}

func getUsedDiskSpace() (int64, error) {
	partitions, err := disk.Partitions(false)
	if err != nil {
		return 0, err
	}

	var usedSpace int64
	seen := make(map[string]bool)

	for _, partition := range partitions {
		if seen[partition.Device] {
			continue
		}
		seen[partition.Device] = true

		usage, err := disk.Usage(partition.Mountpoint)
		if err != nil {
			continue
		}

		usedSpace += int64(usage.Used)
	}

	return usedSpace, nil
}

// CollectTelemetry gathers all telemetry metrics
func CollectTelemetry(hw *StaticHardware) (*Telemetry, error) {
	tel := &Telemetry{}

	// TIER 1: Disk usage percentage (across all disks)
	usedDisk, err := getUsedDiskSpace()
	if err != nil {
		return nil, fmt.Errorf("failed to get disk usage: %v", err)
	}
	tel.DiskUsagePercentage = float64(usedDisk) / float64(hw.TotalDiskSpace) * 100.0

	// TIER 1: Uptime
	uptime, err := host.Uptime()
	if err != nil {
		return nil, fmt.Errorf("failed to get uptime: %v", err)
	}
	tel.Uptime = uptime

	// TIER 2: CPU Usage Percentage (measured over 1 second)
	cpuPercent, err := cpu.Percent(time.Second, false)
	if err != nil || len(cpuPercent) == 0 {
		return nil, fmt.Errorf("failed to get CPU usage: %v", err)
	}
	tel.CpuUsagePercentage = cpuPercent[0]

	// TIER 2: RAM usage percentage
	vmStat, err := mem.VirtualMemory()
	if err != nil {
		return nil, fmt.Errorf("failed to get RAM stats: %v", err)
	}
	tel.RamUsagePercentage = vmStat.UsedPercent

	// TIER 2: Swap used (bytes)
	swapStat, err := mem.SwapMemory()
	if err != nil {
		return nil, fmt.Errorf("failed to get swap stats: %v", err)
	}
	tel.SwapUsedBytes = int64(swapStat.Used)

	return tel, nil
}
