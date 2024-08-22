function displayMatchingRows(value){
    let regex_string = value.replaceAll(' ','|');
    $('.error-list').each(function(){
        let found_row = false;
        $(this).children('.row-wrapper').each(function(){
            if($(this).text().match(regex_string)){
                $(this).show();
                found_row = true;
            } else {
                $(this).hide();
            }
        });
        if(found_row){
            $(this).show();
        } else {
            $(this).hide();
        }
    });
};