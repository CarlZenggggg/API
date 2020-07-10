document.addEventListener("DOMContentLoaded", () => {
    $('.summernote').summernote({
        placeholder: 'Let the words tumble...',
        tabsize: 2,
        height: 300
    });
});

function clearNoNum(obj) {
    obj.value = obj.value.replace(/[^\d.]/g, "");
    obj.value = obj.value.replace(/^\./g, "");
    obj.value = obj.value.replace(/\.{2,}/g, ".");
    obj.value = obj.value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
    obj.value = obj.value.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');
}