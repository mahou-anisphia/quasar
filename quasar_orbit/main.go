package main

import (
	"bytes"
	"encoding/json"
	"flag"
	"fmt"
	"log"
	"net/http"
	"strings"
)

type OutputConfig struct {
	OutputType string
	ReqURL     string
	ReqHeader  string
}

func parseFlags() (*StaticHardware, *OutputConfig, error) {
	serverName := flag.String("name", "", "Server name (required)")
	totalCPU := flag.Int("cpu", 1, "Total CPU cores (fallback if auto-detect fails)")
	totalRAM := flag.Int64("ram", 0, "Total RAM in bytes (fallback if auto-detect fails)")
	totalPhysicalRAMBar := flag.Int("ramsticks", 1, "Number of physical RAM sticks (default: 1)")
	totalDiskSpace := flag.Int64("disk", 0, "Total disk space in bytes (fallback if auto-detect fails)")
	totalDiskDrive := flag.Int("drives", 1, "Number of disk drives (default: 1)")

	outputType := flag.String("output", "print", "Output type: 'print' or 'http' (default: print)")
	reqURL := flag.String("url", "", "HTTP endpoint URL (required if output=http)")
	reqHeader := flag.String("header", "", "HTTP headers in format 'Key1:Value1,Key2:Value2'")

	flag.Parse()

	// Validate server name (required)
	if *serverName == "" {
		return nil, nil, fmt.Errorf("server name is required: use --name flag")
	}

	// Validate output type
	outputTypeLower := strings.ToLower(*outputType)
	if outputTypeLower != "print" && outputTypeLower != "http" {
		log.Printf("Warning: unsupported output type '%s', falling back to 'print'\n", *outputType)
		outputTypeLower = "print"
	}

	// Validate URL if output type is HTTP
	if outputTypeLower == "http" && *reqURL == "" {
		return nil, nil, fmt.Errorf("--url is required when output type is 'http'")
	}

	// Return fallback values - these will be used only if detection fails
	fallback := &StaticHardware{
		ServerName:          *serverName,
		TotalCPU:            *totalCPU,
		TotalRAM:            *totalRAM,
		TotalPhysicalRAMBar: *totalPhysicalRAMBar,
		TotalDiskSpace:      *totalDiskSpace,
		TotalDiskDrive:      *totalDiskDrive,
	}

	outputConfig := &OutputConfig{
		OutputType: outputTypeLower,
		ReqURL:     *reqURL,
		ReqHeader:  *reqHeader,
	}

	return fallback, outputConfig, nil
}

func sendHTTPRequest(hw *StaticHardware, tel *Telemetry, config *OutputConfig) error {
	// Prepare payload
	payload := map[string]interface{}{
		"server": map[string]interface{}{
			"serverName":          hw.ServerName,
			"totalCpu":            hw.TotalCPU,
			"totalRam":            hw.TotalRAM,
			"totalPhysicalRamBar": hw.TotalPhysicalRAMBar,
			"totalDiskSpace":      hw.TotalDiskSpace,
			"totalDiskDrive":      hw.TotalDiskDrive,
		},
		"telemetry": map[string]interface{}{
			"diskUsagePercentage": tel.DiskUsagePercentage,
			"uptime":              tel.Uptime,
			"cpuUsagePercentage":  tel.CpuUsagePercentage,
			"ramUsagePercentage":  tel.RamUsagePercentage,
			"swapUsedBytes":       tel.SwapUsedBytes,
		},
	}

	jsonData, err := json.Marshal(payload)
	if err != nil {
		return fmt.Errorf("failed to marshal JSON: %v", err)
	}

	// Create HTTP request
	req, err := http.NewRequest("POST", config.ReqURL, bytes.NewBuffer(jsonData))
	if err != nil {
		return fmt.Errorf("failed to create HTTP request: %v", err)
	}

	// Set default content type
	req.Header.Set("Content-Type", "application/json")

	// Parse and set custom headers
	if config.ReqHeader != "" {
		headers := strings.Split(config.ReqHeader, ",")
		for _, header := range headers {
			parts := strings.SplitN(strings.TrimSpace(header), ":", 2)
			if len(parts) == 2 {
				key := strings.TrimSpace(parts[0])
				value := strings.TrimSpace(parts[1])
				req.Header.Set(key, value)
			}
		}
	}

	// Send request
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return fmt.Errorf("HTTP request failed: %v", err)
	}
	defer resp.Body.Close()

	// Check response status
	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		return fmt.Errorf("HTTP request failed with status: %d %s", resp.StatusCode, resp.Status)
	}

	fmt.Printf("✅ Data sent successfully to %s (Status: %d)\n", config.ReqURL, resp.StatusCode)
	return nil
}

func printOutput(hw *StaticHardware, tel *Telemetry) {
	// Display static hardware configuration
	fmt.Println("--- STATIC HARDWARE CONFIGURATION ---")
	fmt.Printf("Server Name: %s\n", hw.ServerName)
	fmt.Printf("Total CPU Cores: %d\n", hw.TotalCPU)
	fmt.Printf("Total RAM: %d GB (%d bytes)\n", hw.TotalRAM/1024/1024/1024, hw.TotalRAM)
	fmt.Printf("Physical RAM Sticks: %d\n", hw.TotalPhysicalRAMBar)
	fmt.Printf("Total Disk Space: %d GB (%d bytes)\n", hw.TotalDiskSpace/1024/1024/1024, hw.TotalDiskSpace)
	fmt.Printf("Total Disk Drives: %d\n", hw.TotalDiskDrive)

	// Display telemetry
	fmt.Println("\n--- TIER 1 METRICS ---")
	fmt.Printf("Disk Usage: %.2f%%\n", tel.DiskUsagePercentage)
	fmt.Printf("Uptime: %d seconds (%.1f hours)\n", tel.Uptime, float64(tel.Uptime)/3600.0)

	fmt.Println("\n--- TIER 2 METRICS ---")
	fmt.Printf("CPU Usage: %.2f%%\n", tel.CpuUsagePercentage)
	fmt.Printf("RAM Usage: %.2f%%\n", tel.RamUsagePercentage)
	fmt.Printf("Swap Used: %d MB (%d bytes)\n", tel.SwapUsedBytes/1024/1024, tel.SwapUsedBytes)

	fmt.Println("\n✅ Telemetry collected successfully!")
}

func main() {
	fmt.Println("=== Quasar Orbit - Server Monitoring Agent ===")
	fmt.Println()

	// Parse CLI flags (get fallback values and output config)
	fallback, outputConfig, err := parseFlags()
	if err != nil {
		log.Fatalf("Error: %v\n\nUsage:\n", err)
	}

	// Detect hardware (with fallback safeguards)
	hw, err := DetectHardware(fallback)
	if err != nil {
		log.Fatalf("Failed to detect hardware: %v\n", err)
	}

	// Collect telemetry
	fmt.Println("--- COLLECTING TELEMETRY ---")
	tel, err := CollectTelemetry(hw)
	if err != nil {
		log.Fatalf("Failed to collect telemetry: %v\n", err)
	}

	fmt.Println()

	// Output based on configuration
	if outputConfig.OutputType == "http" {
		err = sendHTTPRequest(hw, tel, outputConfig)
		if err != nil {
			log.Fatalf("Failed to send HTTP request: %v\n", err)
		}
	} else {
		printOutput(hw, tel)
	}
}