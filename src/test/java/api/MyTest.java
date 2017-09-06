package api;

import generated.tables.records.ReceiptsRecord;

import io.dropwizard.jersey.validation.Validators;
import org.junit.Test;

import javax.validation.Validator;
import java.math.BigDecimal;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.collection.IsEmptyCollection.empty;

public class MyTest {

    private final Validator validator = Validators.newValidator();

    @Test
    public void testValid() {
        ReceiptsRecord testRecord = new ReceiptsRecord();
        testRecord.setMerchant("test");
        testRecord.setId(1);
        testRecord.setAmount(new BigDecimal(12.0));
        TagResponse tag = new TagResponse(testRecord);
        assertThat(validator.validate(tag), empty());
    }
}