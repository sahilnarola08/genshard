import React, { useState, useEffect } from 'react'

// interface IProps {
//   itemLength: number
//   onChangePage: ({}) => void
//   rowsPerPage: number
// }

// type pagerProps = {
//   startIndex: number
//   endIndex: number
//   currentPage: number
//   totalPages: number
//   pages: Object[]
//   totalItems: number
//   pageSize: number
//   startPage: number
//   endPage: number
// }

// const Pagination = ({
//   itemLength = 10,
//   rowsPerPage = 10,
//   onChangePage,
// }: IProps) => {
//   const [pager, setPager] = useState<pagerProps>()
//   const [initialPage, setInitialPage] = useState(1)

//   useEffect(() => {
//     if (itemLength > 0) {
//       setPage(initialPage)
//       setInitialPage(1)
//     }
//   }, [itemLength])

//   const setPage = (page: any) => {
//     let tmppager = pager

//     // get new pager object for specified page
//     tmppager = getPager(itemLength, page, rowsPerPage)

//     // update state
//     setPager(tmppager)

//     // call change page function in parent component
//     onChangePage({
//       start: tmppager.startIndex,
//       end: tmppager.endIndex + 1,
//     })
//   }

//   const getPager = (
//     totalItems: number,
//     currentPage: number,
//     pageSize: number
//   ) => {
//     // default to first page
//     currentPage = currentPage || 1

//     // default page size is 10
//     pageSize = pageSize || 10

//     // calculate total pages
//     let totalPages = Math.ceil(totalItems / pageSize)

//     let startPage: number, endPage
//     if (totalPages <= 4) {
//       // less than 10 total pages so show all
//       startPage = 1
//       endPage = totalPages
//     } else {
//       // more than 10 total pages so calculate start and end pages
//       if (currentPage <= 2) {
//         startPage = 1
//         endPage = 4
//       } else if (currentPage + 2 >= totalPages) {
//         startPage = totalPages - 3
//         endPage = totalPages
//       } else {
//         startPage = currentPage - 1
//         endPage = currentPage + 2
//       }
//     }

//     // calculate start and end item indexes
//     let startIndex = (currentPage - 1) * pageSize
//     let endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1)

//     // create an array of pages to ng-repeat in the pager control
//     let pages = [...Array(endPage + 1 - startPage).keys()].map(
//       (i) => startPage + i
//     )

//     // return object with all pager properties required by the view
//     return {
//       totalItems: totalItems,
//       currentPage: currentPage,
//       pageSize: pageSize,
//       totalPages: totalPages,
//       startPage: startPage,
//       endPage: endPage,
//       startIndex: startIndex,
//       endIndex: endIndex,
//       pages: pages,
//     }
//   }

//   return (
//     <div style={{display:'flex' ,justifyContent:'center',alignItems:'center'}} className='pageButtons' >
//       <button
//         className="changeButton"
//         disabled={pager?.currentPage === 1}
//         onClick={() => setPage((pager?.currentPage || 1) - 1)}
//       >
//         {'<'}
//       </button>
//       <div className="pageNum">
//         Page <span>{pager?.currentPage}</span> of <span>{pager?.totalPages}</span>
//       </div>
//       <button
//         className="changeButton"
//         disabled={(pager?.currentPage || 1) === (pager?.totalPages || 1)}
//         onClick={() => setPage((pager?.currentPage || 1) + 1)}
//       >
//         {'>'}
//       </button>
//     </div>
//   )
// }

// export default Pagination
import './style.sass'
import ReactPaginate from 'react-paginate';

const iconStyles = {
  fontSize: 25,
  marginBottom: 7,
  display: 'block',
  fontWeight: 500,
  color: '#ffffff'
}

const PreviousLabel = <span style={iconStyles}>{"<"}</span>
const NextLabel = <span style={iconStyles}>{">"}</span>

interface IPagination {
  page: number
  onPageChange: any
  totalPages: number
}

export default function Pagination(props: IPagination) {
  const { page, onPageChange, totalPages } = props
  return (
    <div className='custom-pagination'>
      <ReactPaginate
        pageCount={Number(totalPages)}
        previousLabel={PreviousLabel}
        nextLabel={NextLabel}
        pageRangeDisplayed={2}
        marginPagesDisplayed={1}
        onPageChange={onPageChange}
        forcePage={page}
      />
    </div>
  )
}
