# Script to update navigation bar on all HTML pages - move Home to right, remove icons
$files = @(
    "risk-assessment.html",
    "quality-inspection.html", 
    "treatment-optimizer.html",
    "optimizer-temperature.html",
    "optimizer-waste.html",
    "optimizer-cost.html"
)

# Pattern to find and replace the entire navigation section
$oldPattern1 = @'
                <!-- Navigation Tabs -->
                <div class="feedguard-tabs">
                    <a href="index.html" class="tab-link">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2">
                            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"></path>
                            <polyline points="9 22 9 12 15 12 15 22"></polyline>
                        </svg>
                        Home
                    </a>
                </div>

                <!-- Right Icons -->
                <div class="feedguard-nav-icons">
'@

$newPattern1 = @'
                <!-- Home Tab (Right Side) -->
                <div class="feedguard-tabs">
                    <a href="index.html" class="tab-link">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2">
                            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"></path>
                            <polyline points="9 22 9 12 15 12 15 22"></polyline>
                        </svg>
                        Home
                    </a>
                </div>
            </div>
        </div>
    </nav>
'@

# Pattern for old 4-tab navigation (if still exists)
$oldNav4Tabs = @'
                <div class="feedguard-tabs">
                    <a href="index.html" class="tab-link">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2">
                            <path
                                d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z">
                            </path>
                        </svg>
                        Process Flow
                    </a>
                    <a href="risk-assessment.html" class="tab-link">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="8" x2="12" y2="12"></line>
                            <line x1="12" y1="16" x2="12.01" y2="16"></line>
                        </svg>
                        Risk Assessment
                    </a>
                    <a href="quality-inspection.html" class="tab-link">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2">
                            <path d="M9 11l3 3L22 4"></path>
                            <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"></path>
                        </svg>
                        Quality Inspection
                    </a>
                    <a href="treatment-optimizer.html" class="tab-link">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2">
                            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"></path>
                        </svg>
                        Treatment Optimizer
                    </a>
                </div>

                <!-- Right Icons -->
                <div class="feedguard-nav-icons">
'@

$newNavHome = @'
                <!-- Home Tab (Right Side) -->
                <div class="feedguard-tabs">
                    <a href="index.html" class="tab-link">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2">
                            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"></path>
                            <polyline points="9 22 9 12 15 12 15 22"></polyline>
                        </svg>
                        Home
                    </a>
                </div>
            </div>
        </div>
    </nav>
'@

foreach ($file in $files) {
    $filePath = "c:\Users\krris\OneDrive\Desktop\bio safety el\$file"
    if (Test-Path $filePath) {
        $content = Get-Content $filePath -Raw
        
        # First try to replace the old 4-tab navigation if it exists
        if ($content -match [regex]::Escape($oldNav4Tabs)) {
            $content = $content -replace [regex]::Escape($oldNav4Tabs), $newNavHome
            Write-Host "Replaced 4-tab nav in: $file"
        }
        # Then replace the current Home + icons pattern
        elseif ($content -match [regex]::Escape($oldPattern1)) {
            $content = $content -replace [regex]::Escape($oldPattern1), $newPattern1
            Write-Host "Replaced Home+icons in: $file"
        }
        
        # Remove any remaining icon buttons section
        $content = $content -replace '(?s)<button class="icon-btn">.*?</button>\s*<button class="icon-btn">.*?</button>\s*<button class="icon-btn user-btn">.*?</button>\s*</div>\s*</div>\s*</div>\s*</nav>', '</div>
        </div>
    </nav>'
        
        Set-Content $filePath -Value $content -NoNewline
        Write-Host "Updated: $file"
    }
}

Write-Host "Navigation update complete!"
