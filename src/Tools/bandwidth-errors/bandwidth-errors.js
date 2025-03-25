function displayMatchingRows(){
    let value = this.value;
    let regex_string = value.replaceAll(' ','|');
    document.querySelectorAll('.error-list').forEach(function(list){
        let found_row = false;
        list.querySelectorAll('.row-wrapper').forEach(function(row){
            if(row.textContent.match(regex_string)){
                row.removeAttribute('style');
                if(!found_row){
                    found_row = true;
                }
            } else {
                row.setAttribute('style','display:none');
            }
        });
        if(found_row){
            list.removeAttribute('style');
        } else {
            list.setAttribute('style','display:none');
        }
    });
};
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('searchbar').addEventListener('change', displayMatchingRows);
});