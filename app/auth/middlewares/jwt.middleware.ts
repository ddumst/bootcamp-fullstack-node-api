import express from "express";
import jwt from "jsonwebtoken";

export class JwtMiddleware {
  private static instance: JwtMiddleware;

  static getInstance() {
    if (!JwtMiddleware.instance) {
      JwtMiddleware.instance = new JwtMiddleware();
    }
    return JwtMiddleware.instance;
  }

  validReqUser(req: any, res: express.Response, next: express.NextFunction) {
    const token = req.get('Authorization');
    const authToken = token?.split(' ')[1];
  
    jwt.verify(authToken, `${process.env.JWT_SECRET}`, { algorithms: ['RS512'] }, (err: any, decoded: any) => {
      if (err) {
        if (err.name === 'JsonWebTokenError') {
          return res.status(401).json({
            error: {
              message: "No se envió ningún Token de autenticación o es inválido."
            }
          });
        }

        if (err.name === 'TokenExpiredError') {
          return res.status(401).json({
            error: {
              message: "El Token de autenticación ha expirado. Por favor, vuelve a iniciar sesión."
            }
          });
        }
      }

      req.user = decoded.user;
      req.authToken = authToken;
      next();
    });
  };
}
