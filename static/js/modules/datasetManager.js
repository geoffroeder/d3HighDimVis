/* FILE LOADING AND PARSING*/ // ##################################################

// modified from http://html5demos.com/file-api

function buildDropZone(divId, labels=false) {
    var holder = document.getElementById(divId),
        state = document.getElementById(divId + 'Status');
    if (typeof window.FileReader === 'undefined') {
        state.className = 'fail';
    } else {
        state.className = 'success';
        state.innerHTML = 'Drop .csv data here';
    }

    holder.ondragover = function () {
        this.className = 'hover';
        return false;
    };
    holder.ondragend = function () {
        this.className = '';
        return false;
    };

    holder.ondrop = function (e) {
        this.className = '';
        e.preventDefault();

        var file = e.dataTransfer.files[0],
            reader = new FileReader();
        reader.onload = function (event) {
            console.log(event.target);
            holder.innerText = event.target.result;
        };

        console.log(file);

        // define callback
        Papa.parse(file, {
            dynamicTyping: true,
            skipEmptyLines: false,
            complete: function (results, file) {
                console.log("Parsing complete:", results, file);
                // GOTCHA: some files have trailing junK
                // TODO: make this principled / automatic
                if (labels) {
                    console.log("label data");
                    $_labels = results.data.slice(0, -1);
                    state = document.getElementById(divId + 'Status');
                    state.innerHTML = 'Currently loaded: ' + file.name;
                } else {
                    console.log("feature data");
                    $_dataset = results.data.slice(0, -1);
                    state = document.getElementById(divId + 'Status');
                    state.innerHTML = 'Currently loaded: ' + file.name;
                }
            }
        });
        return false;
    };
}

var datasetManager = {

    $_dataset: null,
    $_labels: null,

    getDataset : function () {
        return $_dataset;
    },

    getLabels : function () {
        return $_labels;
    },


    init: function() {
        buildDropZone('featuresLoader');
        buildDropZone('labelsLoader', labels=true);
    }
}