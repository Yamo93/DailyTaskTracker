import React from 'react';
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';

const DailyTaskPagination = (props) => {
    return (
        <Pagination size="sm" aria-label="Page navigation example">
            <PaginationItem onClick={props.goToPreviousPage}>
                <PaginationLink previous={true} />
            </PaginationItem>
            {props.arrayWithPageNumbers.map(pageNumber =>
                <PaginationItem key={pageNumber} active={pageNumber === props.currentPage}>
                    <PaginationLink onClick={() => props.setCurrentPage(pageNumber)}>
                        {pageNumber}
                    </PaginationLink>
                </PaginationItem>
                )}
            <PaginationItem onClick={props.goToNextPage}>
                <PaginationLink next={true} />
            </PaginationItem>
        </Pagination>
    );
}

export default DailyTaskPagination;