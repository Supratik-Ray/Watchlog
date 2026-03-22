"use client"

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

export default function GenreResultPagination({
  currentPage,
  totalPages,
  baseLink,
}: {
  currentPage: number
  totalPages: number
  baseLink: string
}) {
  let pages = []
  if (currentPage <= 3) {
    pages = [1, 2, 3]
  } else if (currentPage === totalPages || currentPage > totalPages - 3) {
    for (let i = totalPages - 2; i <= totalPages; i++) {
      pages.push(i)
    }
  } else {
    for (let i = currentPage - 1; i <= currentPage + 1; i++) {
      pages.push(i)
    }
  }

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={currentPage === 1 ? "#" : `${baseLink}&page=${pages[0] - 1}`}
          />
        </PaginationItem>
        {pages.map((page) => (
          <PaginationItem key={page}>
            <PaginationLink
              href={`${baseLink}&page=${page}`}
              isActive={page === currentPage}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext
            href={
              currentPage === totalPages
                ? "#"
                : `${baseLink}&page=${pages.at(-1)! + 1}`
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
