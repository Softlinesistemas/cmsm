exports.up = function(knex) {
  return knex.schema
    .createTable('Sala', function(table) {
      table.integer('CodSala').notNullable().primary();
      table.string('Sala', 20).notNullable();
      table.integer('QtdCadeiras').notNullable();
      table.string('Predio', 10);
      table.string('Andar', 10);
      table.string('Turma', 20);
      table.string('Status', 6);
      table.string('PortadorNec', 1);
      table.integer('QtdPortNec');
    })

    .createTable('Funcao', function(table) {
      table.string('ProcessoSel', 255).notNullable().primary();
      table.date('NascIniEF');
      table.date('NascFimEF');
      table.date('DataIniEF');
      table.string('HoraIniEF', 5);
      table.string('HoraFimEF', 5);
      table.date('NascIniEM');
      table.date('NascFimEM');
      table.string('HoraIniEM', 5);
      table.string('HoraFimEM', 5);
      table.decimal('ValInscricao', 9, 2);
      table.date('GRUDataFim');
      table.string('GRUHoraFim', 5);
      table.decimal('NotaMinMat', 5, 2);
      table.decimal('NotaMinPor', 5, 2);
      table.string('EditalCaminho', 100);
      table.string('CronogramaCaminho', 100);
      table.string('DocumentosCaminho', 100);
    })
    
    .createTable('Cota', function(table) {
      table.increments('id').primary();
      table.string('Status', 1).notNullable();
      table.string('Descricao', 100).notNullable();
    })

    .createTable('Candidato', function(table) {
      table.integer('CodIns').notNullable().primary();
      table.integer('CodUsu').notNullable();
      table.string('Nome', 100).notNullable();
      table.string('Seletivo', 10).notNullable();
      table.dateTime('DataCad').notNullable();
      table.string('HoraCad', 5).notNullable();
      table.string('CPF', 12).notNullable();
      table.dateTime('Nasc');
      table.string('Sexo', 1);
      table.string('Email', 100);
      table.string('Cep', 9);
      table.string('Endereco', 60);
      table.string('Complemento', 30);
      table.string('Bairro', 30);
      table.string('Cidade', 30);
      table.string('UF', 2);
      // Cotação até 10 colunas
      for (let i = 1; i <= 10; i++) {
        table.integer(`CodCot${i}`).unsigned()
          .references('id')
          .inTable('Cota')
          .onDelete('SET NULL');
      }
      table.string('PortadorNec', 1);
      table.string('AtendimentoEsp', 1);
      table.string('Responsavel', 100);
      table.string('CPFResp', 12);
      table.string('isencao', 12);
      table.string('observacao', 255);
      table.dateTime('NascResp');
      table.string('SexoResp', 1);
      table.string('CepResp', 9);
      table.string('EnderecoResp', 60);
      table.string('ComplementoResp', 30);
      table.string('BairroResp', 30);
      table.string('CidadeResp', 30);
      table.string('UFResp', 2);
      table.string('ProfissaoResp', 100);
      table.string('EmailResp', 100);
      table.string('TelResp', 14);
      table.string('Parentesco', 20);
      table.string('PertenceFA', 20);
      table.string('CaminhoFoto', 100);
      table.string('CaminhoDoc1', 100);
      table.string('CaminhoDoc2', 100);
      table.string('RegistroGRU', 100);
      table.dateTime('GRUData');
      table.decimal('GRUValor', 9, 2);
      table.string('GRUHora', 5);
      table.integer('CodSala').unsigned();
      table.dateTime('DataEnsalamento');
      table.string('HoraEnsalamento', 6);
      table.integer('CodUsuEnsalamento');
      table.string('Status', 20);
      table.string('CaminhoResposta', 100);
      table.string('CaminhoRedacao', 100);
      table.string('RevisaoGabarito', 1);
      table.date('DataImportacao');
      table.string('HoraImportacao', 5);
      table.integer('CodUsuImportacao');
      table.decimal('NotaMatematica', 5, 2);
      table.decimal('NotaPortugues', 5, 2);
      table.string('NotaRedacao', 6);
      table.dateTime('DataRevisao');
      table.integer('CodUsuRev');

      // Foreign Key para Sala
      table.foreign('CodSala').references('Sala.CodSala');
    })

    .createTable('Senha', function(table) {
      table.integer('CodUsu').notNullable().primary();
      table.string('Usuario', 20).notNullable();
      table.string('Senha', 255);
      table.string('ADM', 1);
      table.dateTime('DataCad').notNullable();
      table.string('HoraCad', 5).notNullable();

    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('Senha')    
    .dropTableIfExists('Candidato')
    .dropTableIfExists('Cota')
    .dropTableIfExists('Funcao')
    .dropTableIfExists('Sala');
};
