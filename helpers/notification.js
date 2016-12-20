
function show(object)
{
    var htmlContent = "";

    switch (object.type) {
        case "warning":
            htmlContent = 
            '<div class="alert alert-block"> <a class="close" data-dismiss="alert" href="#">×</a>'+
            '<h4 class="alert-heading">Warning!</h4>'+
            object.text+ 
            '</div>'; 
            break;

        case "success":
            htmlContent = 
            '<div class="alert alert-success alert-block"> <a class="close" data-dismiss="alert" href="#">×</a>'+
            '<h4 class="alert-heading">Success!</h4>'+
            object.text+
            '</div>';
            break;

        case "info":
            htmlContent = 
            '<div class="alert alert-info alert-block"> <a class="close" data-dismiss="alert" href="#">×</a>'+
            '<h4 class="alert-heading">Info!</h4>'+
            object.text+
            '</div>';
            break;

        case "error":
            htmlContent = 
            '<div class="alert alert-error alert-block"> <a class="close" data-dismiss="alert" href="#">×</a>'+
            '<h4 class="alert-heading">Error!</h4>'+
            object.text+
            '</div>';
            break;                    
    
        default:
            htmlContent = "";
            break;
    }

    return htmlContent;
}

exports.show = show;