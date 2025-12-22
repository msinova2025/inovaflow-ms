# Exporta o banco de dados completo do container Docker
$Date = Get-Date -Format "yyyy-MM-dd_HH-mm"
$OutputFile = "database/backup_msinova_$Date.sql"

Write-Host "Iniciando backup do banco de dados para $OutputFile..."

docker exec -t msinova-db pg_dump -U postgres -d msinova > $OutputFile

if ($?) {
    Write-Host "Backup concluído com sucesso!" -ForegroundColor Green
} else {
    Write-Host "Erro ao realizar o backup." -ForegroundColor Red
}
