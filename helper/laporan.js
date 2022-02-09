const sequelize = require("../configs/database");

module.exports = {
  ViewReportLedge: async (query = { startDate: "", endDate: "" }) => {
    return sequelize.query(`
        SELECT 
            x.*,
            SUM(x.amount) OVER (ORDER BY x.gldate ASC ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) as balance
        FROM(
            SELECT 
                date('${query.startDate}') as gldate,
                sa.code as kode,
                sa.deskripsi as deskripsi,
                0 as debit,
                0 as credit,
                COALESCE(sa.jumlah, 0)+COALESCE(y.debit, 0)-COALESCE(y.credit, 0) as amount,
                1 as nourut
            FROM "SaldoAwal" sa 
            LEFT JOIN (
                SELECT sum(COALESCE(x.debit, 0)) as debit, sum(COALESCE(x.credit, 0)) as credit
                FROM (
                    SELECT 
                        bp_cr.tanggal, 
                        0 as debit,
                        bp_cr.total as credit,
                        2 as nourut 
                    FROM "BillPayment" bp_cr WHERE bp_cr."isDelete" = false
        
                    UNION ALL
        
                    SELECT 
                        rp_db.tanggal, 
                        rp_detail."totalPenerimaan" as debit,
                        0 as credit,
                        3 as nourut 
                    FROM "ReceivePayment" rp_db  
                    INNER JOIN "ReceivePaymentDetail" rp_detail 
                        ON rp_detail."idReceivePayment" = rp_db."id" 
                            AND rp_detail."isDelete" = false
                    WHERE rp_db."isDelete" = false
        
                    UNION ALL
        
                    SELECT 
                        cr_db.tanggal, 
                        cr_db.jumlah as debit,
                        0 as credit,
                        4 as nourut 
                    FROM "CashReceive" cr_db WHERE cr_db."isDelete" = false
        
                    UNION ALL
        
                    SELECT 
                        cd_cr.tanggal, 
                        0 as debit,
                        cd_cr.jumlah as credit,
                        5 as nourut 
                    FROM "CashDisbursement" cd_cr WHERE cd_cr."isDelete" = false
                ) x
            ) y on true
            WHERE sa."isDelete" = false
        
            UNION ALL
        
            SELECT 
                bp.tanggal as gldate,
                b."noTransaksi" as kode,
                'Bill Payment' as deskripsi,
                0 as debit,
                COALESCE(bp.total, 0) as credit,
                COALESCE(bp.total, 0)*-1 amount,
                2 as nourut
            FROM "BillPayment" bp 
            INNER JOIN "Bill" b ON bp."idBill" = b."id" 
            WHERE bp."isDelete" = false 
                AND DATE(bp.tanggal)>=DATE('${query.startDate}') /* FROM */
                AND DATE(bp.tanggal)<=DATE('${query.endDate}') /* TO */
                
            UNION ALL
                
            SELECT 
                rp.tanggal as gldate,
                rp."noReceive" as kode,
                'Receive Payment' as deskripsi,
                COALESCE(rpd."totalPenerimaan", 0) as debit,
                0 as credit,
                COALESCE(rpd."totalPenerimaan", 0) as amount,
                3 as nourut
            FROM "ReceivePayment" rp
            INNER JOIN "ReceivePaymentDetail" as rpd ON rp."id" = rpd."idReceivePayment" AND rpd."isDelete" = false
            WHERE rp."isDelete" = false
                AND DATE(rp.tanggal)>=DATE('${query.startDate}') /* FROM */
                AND DATE(rp.tanggal)<=DATE('${query.endDate}') /* TO */
        
            UNION ALL
        
            SELECT 
                cr.tanggal as gldate,
                cr.code as kode,
                'Cash Receive' as deskripsi,
                COALESCE(cr.jumlah, 0) as debit,
                0 as credit,
                COALESCE(cr.jumlah, 0) as amount,
                4 as nourut
            FROM "CashReceive" cr
            WHERE cr."isDelete" = false
                AND DATE(cr.tanggal)>=DATE('${query.startDate}') /* FROM */
                AND DATE(cr.tanggal)<=DATE('${query.endDate}') /* TO */
        
            UNION ALL
        
            SELECT 
                cd.tanggal as gldate,
                cd.code as kode,
                'Cash Disbursement' as deskripsi,
                0 as debit,
                COALESCE(cd.jumlah, 0) as credit,
                COALESCE(cd.jumlah, 0)*-1 as amount,
                5 as nourut
            FROM "CashDisbursement" cd
            WHERE cd."isDelete" = false
                AND DATE(cd.tanggal)>=DATE('${query.startDate}') /* FROM */
                AND DATE(cd.tanggal)<=DATE('${query.endDate}') /* TO */
        ) x
        ORDER BY x.gldate
        `);
  },
};
