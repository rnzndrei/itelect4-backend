import { Router, type Request, type Response } from "express";
import { Transaction } from "../models/Transaction";
import { requireAuth } from "../middleware/auth";
import type { NewTransactionBody } from "../types/index";

export const transactionRouter = Router();

// ONE LINE: Every route below this is protected by the token check
transactionRouter.use(requireAuth);

interface IdParam {
  id: string;
}

// GET /api/transactions -- only the ones belonging to this token
transactionRouter.get("/", async (req: Request, res: Response) => {
  const transactions = await Transaction.find({
    userId: req.userId,
  }).sort({ requestDate: -1 });
  
  res.json(transactions);
});

// GET /api/transactions/:id
transactionRouter.get(
  "/:id",
  async (req: Request<IdParam>, res: Response) => {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      userId: req.userId, // Security: must belong to the logged-in user
    });

    if (!transaction) {
      res.status(404).json({ message: "No transaction with that id" });
      return;
    }

    res.json(transaction);
  }
);

// POST /api/transactions
transactionRouter.post(
  "/",
  async (req: Request<unknown, unknown, NewTransactionBody>, res: Response) => {
    const transaction = await Transaction.create({
      ...req.body,
      userId: req.userId, // Owner comes off the verified token, NOT the request body
    });

    res.status(201).json(transaction);
  }
);

// PATCH /api/transactions/:id
transactionRouter.patch(
  "/:id",
  async (
    req: Request<IdParam, unknown, Partial<NewTransactionBody>>,
    res: Response
  ) => {
    const transaction = await Transaction.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true, runValidators: true } // runValidators enforces schema rules on updates!
    );

    if (!transaction) {
      res.status(404).json({ message: "No transaction with that id" });
      return;
    }

    res.json(transaction);
  }
);

// DELETE /api/transactions/:id
transactionRouter.delete(
  "/:id",
  async (req: Request<IdParam>, res: Response) => {
    const transaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!transaction) {
      res.status(404).json({ message: "No transaction with that id" });
      return;
    }

    // 204 means "done, and there is deliberately no body to send"
    res.status(204).send();
  }
);