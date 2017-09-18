package dao;

import generated.tables.records.TagsRecord;
import generated.tables.records.ReceiptsRecord;
import org.jooq.Configuration;
import org.jooq.DSLContext;
import org.jooq.impl.DSL;

import java.math.BigDecimal;
import java.util.List;

import static com.google.common.base.Preconditions.checkState;
import static generated.Tables.RECEIPTS;
import static generated.Tables.TAGS;

public class TagDao {
    DSLContext dsl;

    public TagDao(Configuration jooqConfig) {
        this.dsl = DSL.using(jooqConfig);
    }

    public void insert(String tag, int receipt_id) {
        TagsRecord tagsRecord = dsl
                .insertInto(TAGS, TAGS.RECEIPT_ID, TAGS.TAG)
                .values(receipt_id, tag)
                .returning(TAGS.ID)
                .fetchOne();

        checkState(tagsRecord != null && tagsRecord.getId() != null, "Insert failed");

        return;
    }

    public void delete(String tag, int receipt_id){
                dsl.delete(TAGS)
                .where(TAGS.TAG.eq(tag))
                .and(TAGS.RECEIPT_ID.eq(receipt_id))
                .execute();
        return;
    }

    public boolean search(String tag, int receipt_id){
        List<TagsRecord> receiptTags = dsl
                .select()
                .from(TAGS)
                .where(TAGS.RECEIPT_ID.eq(receipt_id))
                .and(TAGS.TAG.eq(tag))
                .fetchInto(TagsRecord.class);
        if (receiptTags.size() == 0){
            return false;
        }
        return true;
    }

    public void write(String tag, int receipt_id){
        if(search(tag, receipt_id) == true) {
            delete(tag, receipt_id);
        }else{
            insert(tag, receipt_id);
        }
    }

    public List<ReceiptsRecord> fetchReceiptsByTag(String tag) {
        List<ReceiptsRecord> receipts = dsl
                .select()
                .from(RECEIPTS)
                .join(TAGS)
                .on(RECEIPTS.ID.eq(TAGS.RECEIPT_ID))
                .where(TAGS.TAG.eq(tag))
                .and(RECEIPTS.ID.eq(TAGS.RECEIPT_ID))
                .fetchInto(ReceiptsRecord.class);
        return receipts;
    }

    public List<String> fetchTagsByReceipts(Integer id) {
        List<String> receipts = dsl
                .select()
                .from(TAGS)
                .join(RECEIPTS)
                .on(RECEIPTS.ID.eq(TAGS.RECEIPT_ID))
                .where(TAGS.RECEIPT_ID.eq(id))
                .and(RECEIPTS.ID.eq(TAGS.RECEIPT_ID))
                .fetch(TAGS.TAG);
        return receipts;
    }
}
