// const api = "http://ec2-54-89-97-105.compute-1.amazonaws.com:8080";
const api = "localhost:8080";


function prepReceipt(receipt) {
    return `<tr class="receipt" id="${receipt.id}">
        <td class="time">${receipt.created.slice(0, 5)}</td>
        <td class="merchant">${receipt.merchantName}</td>
        <td class="amount">$${receipt.value}</td>
        <td class="tags">${receipt.tags}</td>
    </tr>`;
}

function loadReceipts() {
    console.log("loading");
    $("#receiptList").empty();
    $.getJSON(api + "/receipts", function(receipts) {
        console.log(receipts);
        for (var i = 0; i < receipts.length; i++) {
            var rectemp = prepReceipt(receipts[i]);
            console.log(rectemp);
            $("#receiptList").append(rectemp);
        }
    })
}

function clearHide() {
    $("#add-form").toggle();
    $("#merchant").val("");
    $("#amount").val("");
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
        var y = $.ajax({
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
});
