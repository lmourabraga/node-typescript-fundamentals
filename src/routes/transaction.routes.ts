import { Router } from 'express';

import TransactionsRepository from '../repositories/TransactionsRepository';

// Vai chamar o serviço que fará o post
import CreateTransactionService from '../services/CreateTransactionService';

const transactionRouter = Router();

/**
 * A const abaixo chamará a classe TransactionsRepository no repositório
 * que irá buscar o método create
 */
const transactionsRepository = new TransactionsRepository();

transactionRouter.get('/', (request, response) => {
  try {
    const transactions = transactionsRepository.all();
    const balance = transactionsRepository.getBalance();

    return response.json({
      transactions,
      balance,
    });
  } catch (err) {
    return response.status(400).json({ error: err.message });
  }
});

transactionRouter.post('/', (request, response) => {
  try {
    /* Desestruturamos os campos necessários para passar na requisição do body */
    const { title, value, type } = request.body;

    /**  A const abaixo irá chamar o serviço (regra de negócio) que irá criar a transação a
     * partir da const transactionsRepository
     */
    const createTransaction = new CreateTransactionService(
      transactionsRepository,
    );

    /**
     * A const abaixo chama o serviço execute para gravar o objeto passado como argumento
     */
    const transaction = createTransaction.execute({
      title,
      value,
      type,
    });

    return response.json(transaction);
  } catch (err) {
    return response.status(400).json({ error: err.message });
  }
});

export default transactionRouter;
