INSERT INTO solution_statuses (name, description, color, message)
VALUES 
('Pendente', 'Aguardando análise inicial', '#f59e0b', 'Sua solução foi recebida e está aguardando análise.'),
('Em Análise', 'Solução sob revisão técnica', '#3b82f6', 'Sua solução está sendo analisada por nossa equipe técnica.'),
('Aprovado', 'Solução aprovada para próxima fase', '#10b981', 'Parabéns! Sua solução foi aprovada!'),
('Rejeitado', 'Solução não atendeu aos critérios', '#ef4444', 'Sua solução não foi selecionada neste momento.')
ON CONFLICT DO NOTHING;
