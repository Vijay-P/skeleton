// const api = "http://ec2-54-89-97-105.compute-1.amazonaws.com:8080";
// const api = "localhost:8080";
const api = ""

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
    <td>$<span class="amount">${receipt.value}</span></td>
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
    $("#cam").toggle();
    $(".loader").toggle();
    $("#start-camera").click(function() {
        if ($("#add-form").is(":visible")) {
            $("#add-form").toggle();
        }
        $("#cam").toggle();
        if ($("#cam").is(":visible") && videoEnabled == false) {
            startVideo();
            $("#vidwrap").css("margin-left", ($(window).width() - $("video").width()) / 4);
            $("#take-pic").css("margin-left", ($("video").width() - $("#take-pic-cancel").width() - $("#take-pic").width()) / 12);
            $(".loader").css("margin-left", Math.abs($("video").width() - $(".loader").width()) / 4);
            $(".loader").css("margin-top", Math.abs($("video").height() - $(".loader").height()) / 2);
        }
    });
    $("#add-receipt").click(function() {
        $("#add-form").toggle();
        if ($("#cam").is(":visible")) {
            $("#cam").toggle();
        }
    });
    $("#cancel-receipt").click(function() {
        clearHide();
    });
    $("#save-receipt").click(function() {
        $.ajax({
            url: api + '/receipts',
            type: 'POST',
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify({
                merchant: $("#merchant").val(),
                amount: parseFloat($("#amount").val())
            })
        }).done(function(data) {
            clearHide();
            loadReceipts();
        });
    });
    $(document).on("click", '.tag', function(event) {
        var tagname = $(this).text().slice(0, -4);
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
            $(this).parent().children(".add-tag").prop("disabled", false);
        }
    });
    $('#take-pic').click(function() {
        $(".loader").toggle();
        takeSnapshot();
    });
    $("#take-pic-cancel").click(function() {
        $("#cam").toggle();
    });
});

let imageCapture;
let track;

let videoEnabled = false;

function attachMediaStream(mediaStream) {
    videoEnabled = true;
    $('video')[0].srcObject = mediaStream;

    // Saving the track allows us to capture a photo
    track = mediaStream.getVideoTracks()[0];
    imageCapture = new ImageCapture(track);
}

function startVideo() {
    navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: {
                    exact: "environment"
                }
            }
        })
        .then(attachMediaStream)
        .catch(error => {
            navigator.mediaDevices.getUserMedia({
                    video: true
                })
                .then(attachMediaStream)
                .catch(error => {
                    console.log('you are fooked');
                })
        })
}

function takeSnapshot() {
    // create a CANVAS element that is same size as the image
    imageCapture.grabFrame()
        .then(img => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;

            canvas.getContext('2d').drawImage(img, 0, 0);
            const base64EncodedImageData = canvas.toDataURL('image/png').split(',')[1];
            $.ajax({
                    url: "/images",
                    type: "POST",
                    data: base64EncodedImageData,
                    contentType: "text/plain",
                    success: function() {},
                })
                .then(response => {
                    $(".loader").toggle();
                    $("#cam").toggle();
                    $("#add-form").toggle();
                    var r_response = JSON.parse(JSON.stringify(response));
                    $("#merchant").val(r_response.merchantName);
                    $("#amount").val(r_response.amount);
                    console.log(r_response.amount);
                })
                .always(() => console.log('request complete'));

            // For debugging, you can uncomment this to see the frame that was captured
            // $('BODY').append(canvas);
        });

}


$(function() {
    $('video').on('play', () => $('#take-pic').prop('disabled', false));
});
