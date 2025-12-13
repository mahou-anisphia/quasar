package main

import (
	"fmt"
	"time"

	"github.com/shirou/gopsutil/v4/cpu"
	"github.com/shirou/gopsutil/v4/disk"
	"github.com/shirou/gopsutil/v4/host"
	"github.com/shirou/gopsutil/v4/load"
	"github.com/shirou/gopsutil/v4/mem"
)

func main() {
	fmt.Println("=== Quasar Orbit - gopsutil Verification ===\n")

	// TIER 1 METRICS
	fmt.Println("--- TIER 1 ---")
	diskStat, _ := disk.Usage("/")
	fmt.Printf("Disk Usage: %.2f%%\n", diskStat.UsedPercent)

	uptime, _ := host.Uptime()
	fmt.Printf("Uptime: %d seconds\n", uptime)

	// TIER 2 METRICS
	fmt.Println("\n--- TIER 2 ---")
	loadAvg, _ := load.Avg()
	fmt.Printf("CPU Load Avg (1min): %.2f\n", loadAvg.Load1)

	// Measure CPU usage over 1 second interval, somehow loadAvg does not work
	cpuPercent, _ := cpu.Percent(time.Second, false)
	fmt.Printf("CPU Usage (1s avg): %.2f%%\n", cpuPercent[0])

	vmStat, _ := mem.VirtualMemory()
	fmt.Printf("RAM Usage: %.2f%%\n", vmStat.UsedPercent)

	swapStat, _ := mem.SwapMemory()
	if swapStat.Total > 0 {
		fmt.Printf("Swap Usage: %.2f%%\n", swapStat.UsedPercent)
	} else {
		fmt.Println("Swap Usage: No swap configured")
	}

	// STATIC HARDWARE INFO - ONLY WORKS FOR CURRENT DISK. DOES NOT COUNT MULTI-DISK
	fmt.Println("\n--- STATIC HARDWARE ---")
	cpuCount, _ := cpu.Counts(true)
	fmt.Printf("Total CPU Cores: %d\n", cpuCount)

	fmt.Printf("Total RAM: %d GB\n", vmStat.Total/1024/1024/1024)
	fmt.Printf("Total Disk Space: %d GB\n", diskStat.Total/1024/1024/1024)

}