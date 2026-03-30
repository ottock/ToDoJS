INSERT INTO
    tasks (
        name,
        created_date,
        priority,
        description,
        status,
        from_date,
        due_date
    )
VALUES
('Planejar sprint da semana',      '2026-03-02', 'H', 'Definir backlog e prioridades da sprint.', false, '2026-03-03', '2026-03-07'),
('Revisar PRs pendentes',          '2026-03-03', 'M', 'Analisar e aprovar pull requests do time.', true,  '2026-03-03', '2026-03-04'),
('Atualizar documentacao da API',  '2026-03-04', 'L', 'Registrar endpoints novos e exemplos.', false, null,         null),
('Corrigir bug de login',          '2026-03-05', 'H', 'Falha intermitente ao autenticar usuario.', true,  '2026-03-05', '2026-03-06'),
('Refatorar service de tarefas',   '2026-03-06', 'M', 'Melhorar legibilidade e reduzir duplicacao.', false, '2026-03-07', '2026-03-10'),
('Configurar pipeline CI',         '2026-03-07', 'H', 'Automatizar testes e lint no merge.', false, '2026-03-08', '2026-03-12'),
('Escrever testes de integracao',  '2026-03-08', 'M', 'Cobrir fluxos de criacao e atualizacao.', false, '2026-03-09', '2026-03-13'),
('Organizar reuniao de alinhamento','2026-03-09', 'L', 'Sincronizar equipe sobre metas do mes.', true,  null,         null),
('Limpar tarefas obsoletas',       '2026-03-10', 'L', 'Remover itens antigos ja concluidos.', true,  '2026-03-10', '2026-03-11'),
('Preparar release v1.2.0',        '2026-03-11', 'H', 'Checklist final para publicacao.', false, '2026-03-12', '2026-03-15');