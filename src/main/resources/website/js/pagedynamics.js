// const api = "http://ec2-54-89-97-105.compute-1.amazonaws.com:8080";
const api = "localhost:8080";


function prepReceipt(receipt) {
    return `<tr class="receipt" id="${receipt.id}">
            <td class="time">${receipt.created.slice(0, 5)}</td>
            <td class="merchant">${receipt.MerchantName}</td>
            <td class="amount">$${receipt.value}</td>
            <td class="tags">Food</td>
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

$(document).ready(function() {
    loadReceipts();
    $("#add-form").toggle();
    $("#add-receipt").click(function() {
        $("#add-form").toggle();
    });
    $("#cancel-receipt").click(function() {
        $("#add-form").toggle();
        $("#merchant").val("");
        $("#amount").val("");
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
            loadReceipts;
        });
    });
});
