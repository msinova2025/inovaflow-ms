import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { statsApi } from "@/lib/api";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Search, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AdminAccesses() {
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [dateFilter, setDateFilter] = useState("");

    const { data: logs, isLoading, refetch } = useQuery({
        queryKey: ["access-logs", page, searchTerm, dateFilter],
        queryFn: () => statsApi.getAccessLogs({
            page,
            limit: 20,
            path: searchTerm,
            start_date: dateFilter
        }),
    });

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Relatório de Acessos</CardTitle>
                <Button variant="ghost" size="icon" onClick={() => refetch()}>
                    <RefreshCw className="h-4 w-4" />
                </Button>
            </CardHeader>
            <CardContent>
                <div className="flex gap-4 mb-6">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar por página..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-8"
                        />
                    </div>
                    <Input
                        type="date"
                        className="w-auto"
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                    />
                </div>

                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Data/Hora</TableHead>
                                <TableHead>Usuário</TableHead>
                                <TableHead>Página</TableHead>
                                <TableHead>IP</TableHead>
                                <TableHead>Dispositivo</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center h-24">
                                        <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                                    </TableCell>
                                </TableRow>
                            ) : logs?.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center h-24">
                                        Nenhum acesso registrado com esses filtros.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                logs?.map((log: any) => (
                                    <TableRow key={log.id}>
                                        <TableCell>
                                            {new Date(log.timestamp).toLocaleString("pt-BR")}
                                        </TableCell>
                                        <TableCell>
                                            {log.full_name ? (
                                                <div className="flex flex-col">
                                                    <span className="font-medium">{log.full_name}</span>
                                                    <span className="text-xs text-muted-foreground">{log.email}</span>
                                                </div>
                                            ) : (
                                                <span className="text-muted-foreground italic">Visitante</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="font-mono text-xs">{log.path}</TableCell>
                                        <TableCell>{log.ip_address || "-"}</TableCell>
                                        <TableCell className="max-w-[200px] truncate" title={log.user_agent}>
                                            {log.metadata?.platform || "Desconhecido"}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                <div className="flex justify-end gap-2 mt-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                    >
                        Anterior
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((p) => p + 1)}
                        disabled={!logs || logs.length < 20}
                    >
                        Próxima
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
