package com.surfinn.glzza.utility;

public class PaginationResponse {
	private int currentPage;
	private int rowCount;
	private int rowCountPerPage;
	private int totalCount;

	public PaginationResponse() {
	}

	public PaginationResponse(int currentPage, int rowCount) {
		this(currentPage, rowCount, -1);
	}

	public PaginationResponse(int currentPage, int rowCount, int totalCount) {
		this.currentPage = currentPage;
		this.rowCount = rowCount;
		if (totalCount > 0 && rowCount > 0) {
			this.rowCountPerPage = (totalCount / rowCount) < 0 ? 1 : (totalCount / rowCount) + 1;
		} else {
			this.rowCountPerPage = 1;
		}
		this.totalCount = totalCount;
	}

	public int getTotalCount() {
		return totalCount;
	}

	public void setTotalCount(int totalCount) {
		this.totalCount = totalCount;
	}

	public int getCurrentPage() {
		return currentPage;
	}

	public void setCurrentPage(int currentPage) {
		this.currentPage = currentPage;
	}

	public int getRowCount() {
		return rowCount;
	}

	public void setRowCount(int rowCount) {
		this.rowCount = rowCount;
	}

	public int getRowCountPerPage() {
		return rowCountPerPage;
	}

	public void setRowCountPerPage(int rowCountPerPage) {
		this.rowCountPerPage = rowCountPerPage;
	}
}
