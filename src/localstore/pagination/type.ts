export interface Pagination {
  sortBy: string;
  descending: boolean;
  page: number;
  rowsNumber: number; // Total
  rowsPerPage: number;
}
