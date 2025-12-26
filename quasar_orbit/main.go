package main

import (
	"flag"
	"fmt"
	"log"
	"math/rand"
	"strings"
	"time"

	"quasar_orbit/service"
)

type OutputConfig struct {
	OutputType string
	Endpoints  []service.HTTPEndpoint
}

// calculateRandomInterval returns a randomized interval within ±20% of the base interval
func calculateRandomInterval(baseInterval int) int {
	rand.Seed(time.Now().UnixNano())
	// Calculate ±20% range
	variation := float64(baseInterval) * 0.20
	minInterval := float64(baseInterval) - variation
	maxInterval := float64(baseInterval) + variation
	// Generate random value in range
	randomInterval := minInterval + rand.Float64()*(maxInterval-minInterval)
	return int(randomInterval)
}

func parseFlags() (*service.StaticHardware, *OutputConfig, error) {
	serverName := flag.String("name", "", "Server name (required)")
	totalCPU := flag.Int("cpu", 1, "Total CPU cores (fallback if auto-detect fails)")
	totalRAM := flag.Int64("ram", 0, "Total RAM in bytes (fallback if auto-detect fails)")
	totalPhysicalRAMBar := flag.Int("ramsticks", 1, "Number of physical RAM sticks (default: 1)")
	totalDiskSpace := flag.Int64("disk", 0, "Total disk space in bytes (fallback if auto-detect fails)")
	totalDiskDrive := flag.Int("drives", 1, "Number of disk drives (default: 1)")

	outputType := flag.String("output", "print", "Output type: 'print' or 'http' (default: print)")

	// Special mode for calculating random sleep interval
	calcSleep := flag.Int("calc-sleep", 0, "Calculate random sleep interval (±20%) for given base interval in seconds")

	// Support for multiple HTTP endpoints
	url1 := flag.String("url1", "", "HTTP endpoint URL 1 (required if output=http)")
	header1 := flag.String("header1", "", "HTTP headers for URL 1 in format 'Key1:Value1,Key2:Value2'")

	url2 := flag.String("url2", "", "HTTP endpoint URL 2 (optional)")
	header2 := flag.String("header2", "", "HTTP headers for URL 2 in format 'Key1:Value1,Key2:Value2'")

	url3 := flag.String("url3", "", "HTTP endpoint URL 3 (optional)")
	header3 := flag.String("header3", "", "HTTP headers for URL 3 in format 'Key1:Value1,Key2:Value2'")

	url4 := flag.String("url4", "", "HTTP endpoint URL 4 (optional)")
	header4 := flag.String("header4", "", "HTTP headers for URL 4 in format 'Key1:Value1,Key2:Value2'")

	url5 := flag.String("url5", "", "HTTP endpoint URL 5 (optional)")
	header5 := flag.String("header5", "", "HTTP headers for URL 5 in format 'Key1:Value1,Key2:Value2'")

	// Legacy support for single endpoint
	reqURL := flag.String("url", "", "HTTP endpoint URL (legacy, use --url1 instead)")
	reqHeader := flag.String("header", "", "HTTP headers (legacy, use --header1 instead)")

	flag.Parse()

	// Special mode: calculate random sleep interval
	if *calcSleep > 0 {
		randomSleep := calculateRandomInterval(*calcSleep)
		fmt.Printf("%d\n", randomSleep)
		return nil, nil, nil // Signal to exit early
	}

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

	// Collect all HTTP endpoints
	var endpoints []service.HTTPEndpoint

	// Legacy support: if --url is used, treat it as url1
	if *reqURL != "" {
		endpoints = append(endpoints, service.HTTPEndpoint{
			URL:    *reqURL,
			Header: *reqHeader,
		})
	} else {
		// Collect all provided URLs
		urls := []string{*url1, *url2, *url3, *url4, *url5}
		headers := []string{*header1, *header2, *header3, *header4, *header5}

		for i := 0; i < len(urls); i++ {
			if urls[i] != "" {
				endpoints = append(endpoints, service.HTTPEndpoint{
					URL:    urls[i],
					Header: headers[i],
				})
			}
		}
	}

	// Validate at least one URL is provided if output type is HTTP
	if outputTypeLower == "http" && len(endpoints) == 0 {
		return nil, nil, fmt.Errorf("at least one URL is required when output type is 'http' (use --url1, --url2, etc.)")
	}

	// Return fallback values - these will be used only if detection fails
	fallback := &service.StaticHardware{
		ServerName:          *serverName,
		TotalCPU:            *totalCPU,
		TotalRAM:            *totalRAM,
		TotalPhysicalRAMBar: *totalPhysicalRAMBar,
		TotalDiskSpace:      *totalDiskSpace,
		TotalDiskDrive:      *totalDiskDrive,
	}

	outputConfig := &OutputConfig{
		OutputType: outputTypeLower,
		Endpoints:  endpoints,
	}

	return fallback, outputConfig, nil
}

func printOutput(hw *service.StaticHardware, tel *service.Telemetry) {
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

	// Early exit for special modes (e.g., calc-sleep)
	if fallback == nil && outputConfig == nil {
		return
	}

	// Detect hardware (with fallback safeguards)
	hw, err := service.DetectHardware(fallback)
	if err != nil {
		log.Fatalf("Failed to detect hardware: %v\n", err)
	}

	// Collect telemetry
	fmt.Println("--- COLLECTING TELEMETRY ---")
	tel, err := service.CollectTelemetry(hw)
	if err != nil {
		log.Fatalf("Failed to collect telemetry: %v\n", err)
	}

	fmt.Println()

	// Output based on configuration
	if outputConfig.OutputType == "http" {
		service.SendToAllEndpoints(hw, tel, outputConfig.Endpoints)
	} else {
		printOutput(hw, tel)
	}
}
