package controllers;

import dao.TagDao;
import api.ReceiptResponse;
import generated.tables.records.TagsRecord;
import generated.tables.records.ReceiptsRecord;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.util.List;

import static java.util.stream.Collectors.toList;

@Path("/tags/{tag}")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class TagController {
    final TagDao tags;

    public TagController(TagDao tags) {
        this.tags = tags;
    }

    @PUT
    public void toggleTag(@PathParam("tag") String tagName, int receiptId ){
        tags.write(tagName, receiptId);
        return;
    }

    @GET
    public List<ReceiptResponse> getTag(@PathParam("tag") String tagName){
        List<ReceiptsRecord> results =  tags.fetchReceiptsByTag(tagName);
        return results.stream().map(ReceiptResponse::new).collect(toList());
    }
}
