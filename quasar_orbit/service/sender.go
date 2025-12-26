package service

import (
	"bytes"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strings"
)

type HTTPEndpoint struct {
	URL            string
	Header         string
	RandomInterval bool
}

func SendHTTPRequest(hw *StaticHardware, tel *Telemetry, endpoint HTTPEndpoint) error {
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
	req, err := http.NewRequest("POST", endpoint.URL, bytes.NewBuffer(jsonData))
	if err != nil {
		return fmt.Errorf("failed to create HTTP request: %v", err)
	}

	// Set default content type
	req.Header.Set("Content-Type", "application/json")

	// Parse and set custom headers
	if endpoint.Header != "" {
		headers := strings.Split(endpoint.Header, ",")
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

	fmt.Printf("✅ Data sent successfully to %s (Status: %d)\n", endpoint.URL, resp.StatusCode)
	return nil
}

func SendToAllEndpoints(hw *StaticHardware, tel *Telemetry, endpoints []HTTPEndpoint) {
	successCount := 0
	failCount := 0

	for i, endpoint := range endpoints {
		fmt.Printf("\n[%d/%d] Sending to: %s\n", i+1, len(endpoints), endpoint.URL)
		err := SendHTTPRequest(hw, tel, endpoint)
		if err != nil {
			log.Printf("❌ Failed to send to %s: %v\n", endpoint.URL, err)
			failCount++
		} else {
			successCount++
		}
	}

	fmt.Printf("\n=== Summary ===\n")
	fmt.Printf("Total endpoints: %d\n", len(endpoints))
	fmt.Printf("Successful: %d\n", successCount)
	fmt.Printf("Failed: %d\n", failCount)
}
