/**
 * @param {import('knex').Knex} knex
 */
exports.seed = async function(knex) {
  await knex('Senha').where('Usuario', 'admin').andWhere("CodUsu", 1).del();

  // Insere novo admin
  await knex('Senha').insert({
    CodUsu: 1,
    Usuario: 'admin',
    ADM: 'X',
    DataCad: knex.fn.now(),
    HoraCad: new Date().toTimeString().slice(0, 5), // 'HH:mm'
    Senha: '123456',
  });
};
