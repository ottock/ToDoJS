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
('Estudar arquitetura de microservicos', '2026-03-12', 'H', 'Revisar conceitos e aplicar no projeto atual.', false, '2026-03-13', '2026-03-18'),
('Ajustar configuracoes do banco',       '2026-03-12', 'M', 'Tunagem inicial de performance no PostgreSQL.', true,  '2026-03-12', '2026-03-14'),
('Documentar estrutura do projeto',      '2026-03-13', 'L', 'Criar guia para novos desenvolvedores.', false, null,         null),
('Implementar autenticacao JWT',         '2026-03-14', 'H', 'Adicionar seguranca baseada em token.', false, '2026-03-15', '2026-03-20'),
('Refatorar camada de persistencia',     '2026-03-15', 'M', 'Separar responsabilidades e melhorar testes.', false, '2026-03-16', '2026-03-21'),
('Monitorar logs de erro',               '2026-03-16', 'M', 'Identificar falhas recorrentes no sistema.', true,  '2026-03-16', '2026-03-17'),
('Planejar migracao de banco',           '2026-03-17', 'H', 'Estruturar mudanca para novo ambiente.', false, '2026-03-18', '2026-03-25'),
('Atualizar dependencias do projeto',    '2026-03-18', 'L', 'Garantir compatibilidade e seguranca.', true,  null,         null),
('Criar dashboard de metricas',          '2026-03-19', 'M', 'Visualizar dados de uso e performance.', false, '2026-03-20', '2026-03-24'),
('Executar testes de carga',             '2026-03-20', 'H', 'Validar comportamento sob alta demanda.', false, '2026-03-21', '2026-03-26'),
('Ajustar sistema de notificacoes',      '2026-03-21', 'M', 'Melhorar entrega e confiabilidade.', false, '2026-03-22', '2026-03-27'),
('Revisar arquitetura geral',            '2026-03-22', 'H', 'Analisar pontos de melhoria no sistema.', false, '2026-03-23', '2026-03-28'),
('Criar script de backup automatico',    '2026-03-23', 'H', 'Garantir recuperacao de dados.', true,  '2026-03-23', '2026-03-24'),
('Padronizar logs da aplicacao',         '2026-03-24', 'L', 'Melhorar rastreabilidade.', false, null,         null),
('Otimizar queries lentas',              '2026-03-25', 'H', 'Identificar gargalos no banco.', false, '2026-03-26', '2026-03-30');