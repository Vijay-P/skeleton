package api;

import com.fasterxml.jackson.annotation.JsonProperty;
import generated.tables.records.ReceiptsRecord;

import java.math.BigDecimal;
import java.sql.Time;

public class TagResponse {
    @JsonProperty
    Integer id;

    @JsonProperty
    String merchantName;

    @JsonProperty
    BigDecimal value;


    public TagResponse(ReceiptsRecord dbRecord) {
        this.id = dbRecord.getId();
        this.merchantName = dbRecord.getMerchant();
        this.value = dbRecord.getAmount();
    }
}
