param(
  [string]$OutputDirectory = $PSScriptRoot
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$bundledPython = Join-Path $env:USERPROFILE '.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe'
$pythonCommand = Get-Command python -ErrorAction SilentlyContinue

if (Test-Path -LiteralPath $bundledPython) {
  $python = $bundledPython
} elseif ($pythonCommand) {
  $python = $pythonCommand.Source
} else {
  throw 'Se necesita Python con Pillow para regenerar el banner.'
}

& $python (Join-Path $PSScriptRoot 'build_banner.py') --output-directory $OutputDirectory

