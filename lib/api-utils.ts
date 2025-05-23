import { NextResponse } from "next/server"

export type ApiResponse<T = any> = {
  success: boolean
  data?: T
  error?: string
  message?: string
  meta?: {
    page?: number
    limit?: number
    total?: number
    totalPages?: number
  }
}

export function successResponse<T>(
  data: T,
  message?: string,
  meta?: ApiResponse["meta"],
): NextResponse<ApiResponse<T>> {
  return NextResponse.json({
    success: true,
    data,
    message,
    meta,
  })
}

export function errorResponse(error: string, status = 400): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      error,
    },
    { status },
  )
}

export function getPaginationParams(searchParams: URLSearchParams) {
  const page = Number.parseInt(searchParams.get("page") || "1")
  const limit = Number.parseInt(searchParams.get("limit") || "10")
  const from = (page - 1) * limit
  const to = page * limit - 1

  return { page, limit, from, to }
}

export function apiResponse<T = any>(
  success: boolean,
  data?: T,
  message?: string,
  error?: string,
  meta?: ApiResponse["meta"],
): ApiResponse<T> {
  return {
    success,
    data,
    message,
    error,
    meta,
  }
}
