import { ParsedQuery, PaginateMeta } from '../middlewares/parse-query'

declare global {
  namespace Express {
    interface Request {
      parsedQuery?: ParsedQuery
      getPaginateMeta?: (total: number) => PaginateMeta
    }
  }
}
