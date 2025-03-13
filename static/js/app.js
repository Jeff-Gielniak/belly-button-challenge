// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    let metadata = data.metadata;
    // Filter the metadata for the object with the desired sample number
    let result = metadata.filter(object => object.id == sample)[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    let panel = d3.select("#sample-metadata");
    // Use `.html("") to clear any existing metadata
    panel.html("");
    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    for (let key in result) {
      console.log(key, result[key]); 
      panel.append("h6").text(`${key}: ${result[key]}`);
    }
  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    let samples = data.samples;
    // Filter the samples for the object with the desired sample number
    let result = samples.filter(object => object.id == sample)[0];
    // Get the otu_ids, otu_labels, and sample_values
    let otu_ids = result.otu_ids;
    let sample_values = result.sample_values;
    let otu_labels = result.otu_labels;
    // Build a Bubble Chart
    let trace2 = {
      x: otu_ids,
      y: sample_values,
      mode: 'markers',
      text: otu_labels,
      marker: {
          size: sample_values,
          color: otu_ids
      }
    };
    let layout2 = {
      title: {text: 'Bacteria Cultures per Sample'}
    };
    // Render the Bubble Chart
    Plotly.newPlot('bubble', [trace2], layout2);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    // Don't forget to slice and reverse the input data appropriately
    otu_ids = otu_ids.slice(0,10);
    otu_ids = otu_ids.reverse();
    otu_ids = otu_ids.map(otu_id => `id: ${otu_id}`);
    //console.log(sample_values);
    sample_values = sample_values.slice(0,10);
    sample_values = sample_values.reverse();
    //console.log(sample_values);
    // Build a Bar Chart
    let layout1 = {
      title: {text: "Top 10 Bacteria Cultures Found"}
    };
    
    let trace1 = {
      x: sample_values,
      y: otu_ids,
      mode: 'markers',
      text: otu_labels,
      hoverinfo:  'text',
      type: 'bar',
      orientation: 'h'
    };
    let data1 = [trace1];
    // Render the Bar Chart
    Plotly.newPlot("bar",data1, layout1);
  });
}
// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    let names = data.names;
    // Use d3 to select the dropdown with id of `#selDataset`
    let dropdownMenu = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    for (let i = 0; i < names.length; i++) {
      dropdownMenu.append("option").text(names[i])
    }
    // Get the first sample from the list
    let firstElement = names[0];
    // Build charts and metadata panel with the first sample
    buildMetadata(firstElement);   
    buildCharts(firstElement);
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
}

// Initialize the dashboard
init();
