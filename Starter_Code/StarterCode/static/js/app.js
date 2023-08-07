// read in data
// command: 
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

 let test
d3.json(url).then(function(data) {console.log(data)});

//Initialize dashboard
function init() {

    //update plot
    let dropDown = d3.select('#selDataset');

    d3.json(url).then((data) => {
        
        //initialize names for loop
        let name = data.names;

        name.forEach((id) => {

        //value id for each loop
        console.log(id);
        dropDown.append('option').text(id).property('value', id);

        });

        // Set initialized lists
        let first = name[0];

        // Initial plot
        samplemetadata(first);

        bar(first);

        bubble(first);

        // Log the value
        console.log(first);

    });     
};

//Default bar plot
function bar(selection){

    d3.json(url).then((data) => {

        //sample data
        let samples = data.samples;

        //get data of current item
        let value = samples.filter(output => output.id == selection);

        //initial point
        let value_init = value[0];

        let otu_ids = value_init.otu_ids;
        let otu_labels = value_init.otu_labels;
        let sample_values = value_init.sample_values;
        console.log(otu_ids, otu_labels, sample_values);

        //set vars for bar chart
        let yticks = otu_ids.slice(0,10).map(id => `OTU ${id}`).reverse();
        let xticks = sample_values.slice(0,10).reverse();
        let labels = otu_labels.slice(0,10).reverse();

        //set trace for bar chart
        let trace = [{
            x: xticks,
            y: yticks,
            text: labels,
            type: 'bar',
            orientation: 'h'
        }];
        Plotly.newPlot("bar", trace);
    });
};

// Default bubble chart
function bubble(selection) {

    // Use D3 to retrieve all of the data
    d3.json(url).then((data) => {
        
        let samples = data.samples;

        //get data of current item
        let value = samples.filter(output => output.id == selection);

        //initial point
        let value_init = value[0];

        // Get the otu_ids, lables, and sample values
        let otu_ids = value_init.otu_ids;
        let otu_labels = value_init.otu_labels;
        let sample_values = value_init.sample_values;

        // Log the data to the console
        console.log(otu_ids, otu_labels, sample_values);
        
        // Set up the trace for bubble chart
        let trace1 = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "Earth"
            }
        };

        // Set up the layout
        let layout = {
            title: "Bacteria Per Sample",
            hovermode: "closest",
            xaxis: {title: "OTU ID"},
        };

        // Call Plotly to plot the bubble chart
        Plotly.newPlot("bubble", [trace1], layout)
    });
};

function samplemetadata(selection) {

    // Use D3 to retrieve all of the data
    d3.json(url).then((data) => {

        // Retrieve all metadata
        let metadata = data.metadata;

        //get data of current item
        let value = metadata.filter(output => output.id == selection);

        // Log the array of metadata objects after the have been filtered
        console.log(value)

        //initial point
        let value_init = value[0];

        // Clear out metadata
        d3.select("#sample-metadata").html("");

        // Use Object.entries to add each key/value pair to the panel
        Object.entries(value_init).forEach(([key, value]) => {

            // Log the individual key/value pairs as they are being appended to the metadata panel
            console.log(key, value);

            d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
        });
    });

};

// update dashboard
function optionChanged(selection) { 

    // Log the new value
    console.log(selection); 

    // Call functions
    samplemetadata(selection);
    bar(selection);
    bubble(selection);
    
};

init();
