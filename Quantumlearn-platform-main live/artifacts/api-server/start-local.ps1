$ErrorActionPreference = 'Stop'

Write-Host 'QuantumLearn API setup'
Write-Host 'Enter secrets directly here. They are used only by this process and are not written to a file.'

function Read-SecretValue([string]$Prompt) {
  $secure = Read-Host $Prompt -AsSecureString
  $pointer = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure)
  try { return [Runtime.InteropServices.Marshal]::PtrToStringBSTR($pointer) }
  finally { [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($pointer) }
}

$env:CLERK_PUBLISHABLE_KEY = Read-Host 'Clerk publishable key (pk_test_...)'
$env:CLERK_SECRET_KEY = Read-SecretValue 'Clerk secret key (sk_test_...)'
$env:AI_PROVIDER_API_KEY = Read-SecretValue 'OpenAI API key'
$env:AI_PROVIDER_URL = 'https://api.openai.com/v1/chat/completions'
$env:AI_PROVIDER_MODEL = 'gpt-4o-mini'
$env:PORT = '3000'

if ([string]::IsNullOrWhiteSpace($env:CLERK_PUBLISHABLE_KEY) -or [string]::IsNullOrWhiteSpace($env:CLERK_SECRET_KEY) -or [string]::IsNullOrWhiteSpace($env:AI_PROVIDER_API_KEY)) {
  throw 'All three keys are required. No server was started.'
}

if (-not (Test-Path '.\dist\index.mjs')) {
  throw 'API build is missing. Run: pnpm.cmd build'
}

Write-Host 'Starting QuantumLearn API on http://localhost:3000'
node '.\dist\index.mjs'