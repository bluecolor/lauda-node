module.exports = {

  getSplitQuery: (owner, table, parallel = 32) => {
    return `SELECT
        --------------------------------------------------------------------------
        dbms_rowid.rowid_create (1,
                                data_object_id,
                                lo_fno,
                                lo_block,
                                0) ROWID_START,
        --------------------------------------------------------------------------
        dbms_rowid.rowid_create (1,
                                data_object_id,
                                hi_fno,
                                hi_block,
                                10000) ROWID_END
        --------------------------------------------------------------------------
      FROM (WITH c1 AS
              (SELECT   *
                    FROM dba_extents
                  WHERE segment_name = UPPER ('${table}')
                    AND owner = UPPER ('${owner}')
                ORDER BY block_id)
          SELECT DISTINCT grp,
              FIRST_VALUE (relative_fno) OVER (PARTITION BY grp ORDER BY relative_fno,
              block_id ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS lo_fno,
              FIRST_VALUE (block_id) OVER (PARTITION BY grp ORDER BY relative_fno,
              block_id ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS lo_block,
              LAST_VALUE (relative_fno) OVER (PARTITION BY grp ORDER BY relative_fno,
              block_id ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS hi_fno,
              LAST_VALUE (block_id + blocks - 1) OVER (PARTITION BY grp ORDER BY relative_fno,
              block_id ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS hi_block,
              SUM (blocks) OVER (PARTITION BY grp) AS sum_blocks
          FROM (SELECT   relative_fno, block_id, blocks,
                          TRUNC(  (  SUM (blocks) OVER (ORDER BY relative_fno,block_id)- 0.01)
                                / (SUM (blocks) OVER () / ${parallel}) ) grp
                    FROM c1
                    WHERE segment_name = UPPER ('${table}')
                    AND owner = UPPER ('${owner}')
                ORDER BY block_id)),
        (SELECT data_object_id
            FROM all_objects
          WHERE object_name = UPPER ('${table}') AND owner = UPPER ('${owner}'))
      `
  }
}