const api = "http://ec2-54-89-97-105.compute-1.amazonaws.com:8080";
// const api = "localhost:8080";

function prepTags(id, tags) {
    var tagstring = "";
    for (var i = 0; i < tags.length; i++) {
        tagstring += `<button receipt_id="${id}" class="tag button"><span class="tagValue">${tags[i]}</span> [x]</button>`;
    }
    return tagstring;
}

function prepReceipt(receipt) {
    return `<tr class="receipt" id="${receipt.id}">
        <td class="time">${receipt.created.slice(0, 5)}</td>
        <td class="merchant">${receipt.merchantName}</td>
        <td class="amount">$${receipt.value}</td>
        <td class="tags">${prepTags(receipt.id, receipt.tags)}
            <button receipt_id="${receipt.id}" class="add-tag button-primary .u-pull-right">Add +</button>
        </td>
    </tr>`;
}

function loadReceipts() {
    $("#receiptList").empty();
    $.getJSON(api + "/receipts", function(receipts) {
        for (var i = 0; i < receipts.length; i++) {
            var rectemp = prepReceipt(receipts[i]);
            $("#receiptList").append(rectemp);
        }
    })
}

function clearHide() {
    $("#add-form").toggle();
    $("#merchant").val("");
    $("#amount").val("");
}

function putTag(id, tag, element) {
    $.ajax({
        url: api + '/tags/' + tag,
        type: 'PUT',
        dataType: 'json',
        contentType: 'application/json',
        data: id
    }).done(function(data) {
        $(element).remove();
    });
}

$(document).ready(function() {
    loadReceipts();
    $("#add-form").toggle();
    $("#add-receipt").click(function() {
        $("#add-form").toggle();
    });
    $("#cancel-receipt").click(function() {
        clearHide();
    });
    $("#save-receipt").click(function() {
        console.log(JSON.stringify({
            merchant: $("#merchant").val(),
            amount: parseInt($("#amount").val())
        }));
        $.ajax({
            url: api + '/receipts',
            type: 'POST',
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify({
                merchant: $("#merchant").val(),
                amount: parseInt($("#amount").val())
            })
        }).done(function(data) {
            clearHide();
            loadReceipts();
        });
        console.log(y)
    });
    $(document).on("click", '.tag', function(event) {
        var tagname = $(this).text().slice(0, -4);
        console.log($(this).attr("receipt_id"), tagname);
        putTag($(this).attr("receipt_id"), tagname, this);
    });
    $(document).on("click", '.add-tag', function(event) {
        $(this).prop("disabled", true);
        var id = $(this).attr("receipt_id");
        var input = `<input receipt_id=${id} class="tag_input" type="text" placeholder="tag" name="tag">`;
        $(this).parent().append(input);
    });
    $(document).on('keyup', ".tag_input", function(e) {
        if (e.keyCode == 13) {
            var id = $(this).attr("receipt_id");
            var tag = $(this).val();
            putTag(id, tag, this);
            var tagstring = `<button receipt_id="${id}" class="tag button"><span class="tagValue">${tag}</span> [x]</button>`;
            $(this).parent().append(tagstring);
            $(this).parent.children(".add-tag").prop("disabled", false);
        }
    });
});
