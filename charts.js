function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
        var samples = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
        var selectedsample = samples.filter(item => item.id == sample);
    ////    console.log(selectedsample)   //// convenient spot to check on data extracted
    //  5. Create a variable that holds the first sample in the array.
        var sampleid = selectedsample[0].id;
    ////    console.log(sampleid);
    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var values_otu_ids = selectedsample[0].otu_ids;
    bar_otu_ids = values_otu_ids.slice(0,10).reverse();
    var values_otu_labels = selectedsample[0].otu_labels;
    bar_otu_labels = values_otu_labels.slice(0,10).reverse();
    var values_sample_values = selectedsample[0].sample_values;
    bar_sample_values = values_sample_values.slice(0,10).reverse();

    // Create variable that holds washing frequency
    var washfreq = data.metadata.filter(sampleObj => sampleObj.id == sample)[0].wfreq;
    console.log(washfreq);

    // BEGIN DELIVERABLE 1

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    
    var yticks = bar_otu_ids.map(item => "OTU " + item);

    // 8. Create the trace for the bar chart. 
    var barData = [{x:bar_sample_values, y:yticks, type:'bar', orientation:'h', text:bar_otu_labels}];
  
    // 9. Create the layout for the bar chart. 
    var barLayout = {title: "Top Ten Bacteria Cultures Found",
                      xaxis: {range:[0,200]}};

    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar",barData,barLayout);

    // BEGIN DELIVERABLE 2

    // 1. Create the trace for the bubble chart.
    var bubblesize = values_sample_values.map(item => item * 0.5)
    var bubbleData = [{x:values_otu_ids,
                        y:values_sample_values,
                        mode:'markers',
                        marker:{size:bubblesize, color: values_otu_ids},
                        text:values_otu_labels}];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {xaxis :{range: [-500,4000]},
                        title: "Bacteria Cultures Per Sample" 
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble",bubbleData,bubbleLayout);


    // BEGIN DELIVERABLE 3

    // 4. Create the trace for the gauge chart.
    
    
    var gaugeData = [{value: washfreq,
                      title: { text: "Belly Button Washing Frequency", font: {size:24} },
                      type: "indicator",
                      mode: "gauge+number+delta",
                      gauge: {
                        axis: { range: [0, 10] , tickwidth: 2},
                        bar: {color: "black"},
                        steps: [
                          {range: [0,2], color: "red" },
                          {range: [2,4], color: "orange"},
                          {range: [4,6], color: "yellow"},
                          {range: [6,8], color: "chartreuse"},
                          {range: [8,10], color: "green"}
                        ]
                      }}];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = {width: 800, height: 400};

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot('gauge', gaugeData, gaugeLayout);


  })};
