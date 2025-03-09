import PropTypes from 'prop-types';
import { CircularProgress, TableCell, TableRow } from "@mui/material";

function TableLoadingWrapper({loading, data, children}) {
    return ( <>
            {data.length > 0 ?
          <>
            {children}
            {loading && <div className={`flex justify-center items-center ${data === 0 ? "h-[45vh]" : "h-[10vh]"}`}>
              <CircularProgress />
            </div>}
          </>
          : loading ? (
            <div className={`flex justify-center items-center ${data === 0 ? "h-[45vh]" : "h-[10vh]"}`}>
              <CircularProgress />
            </div>
          ) : 
          <table className='flex justify-center items-center'>
            <tbody>
              <TableRow>
                <TableCell>
                  No Data Found
                </TableCell>
              </TableRow>
            </tbody>
          </table>
          }
    </> );
}

TableLoadingWrapper.propTypes = {
    loading: PropTypes.bool.isRequired,
    data: PropTypes.array.isRequired,
    children: PropTypes.node
};

export default TableLoadingWrapper;