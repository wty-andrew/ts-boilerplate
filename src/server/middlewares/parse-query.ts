// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../types/global.d.ts" />
import { RequestHandler } from 'express'
import _ from 'lodash'

type Sort = [string, 'desc' | 'asc']

export interface ParsedQuery {
  page: number
  skip: number
  limit: number
  sort: Sort[]
}

export interface QueryOptions {
  limit?: number
  maxLimit?: number
  sortableColumns?: string[]
}

export interface PaginateMeta {
  total: number
  page: number
  limit: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export const parseQuery = ({
  limit = 10,
  maxLimit = 50,
  sortableColumns,
}: QueryOptions = {}): RequestHandler => async (req, res, next) => {
  const page = Math.max(parseInt(`${req.query.page || 1}`), 1)
  const perPage = _.clamp(parseInt(`${req.query.limit || limit}`), 0, maxLimit)

  const sort: Sort[] = []
  if (Array.isArray(req.query.sort)) {
    for (const s of req.query.sort as string[]) {
      const [field, order] = s.split(':')
      const isFieldValid =
        sortableColumns === undefined || sortableColumns.includes(field)
      if (isFieldValid && (order === 'desc' || order === 'asc')) {
        sort.push([field, order])
      }
    }
  }

  const skip = (page - 1) * perPage
  req.parsedQuery = {
    page,
    skip,
    limit: perPage,
    sort,
  }
  req.getPaginateMeta = (total: number): PaginateMeta => ({
    total,
    page,
    limit,
    hasNextPage: page * limit < total,
    hasPrevPage: skip > 0,
  })

  next()
}
