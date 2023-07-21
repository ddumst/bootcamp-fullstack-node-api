import express from "express";

export const handlerMessageError = (title: string = '¡Oops!', message: string, res: express.Response, status: number = 400) => {
  return res.status(status).json({
    ok: false,
    title,
    message
  })
}
