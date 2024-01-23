document.addEventListener("DOMContentLoaded", function() {
  // Fetch data using d3.json
  d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json")
    .then(function(data) {
      // Define a function to update charts and sample metadata based on selected sample
      function updateCharts(selectedSample) {
        // Filter data for the selected sample
        const selectedData = data.samples.find(sample => sample.id === selectedSample);
        const selectedMetadata = data.metadata.find(metadata => metadata.id == selectedSample);

        const metadataDiv = d3.select("#sampleMetadata");
        metadataDiv.html(""); // Clear previous content
        
        Object.entries(selectedMetadata).forEach(([key, value]) => {
          metadataDiv.append("p").text(`${key}: ${value}`);
        });
        console.log("Selected Metadata:", selectedMetadata); 

        if (selectedData && selectedMetadata) {
          // Update the bar chart
          const barTrace = {
            type: 'bar',
            orientation: 'h',
            x: selectedData.sample_values.slice(0, 10).reverse(),
            y: selectedData.otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse(),
            text: selectedData.otu_labels.slice(0, 10).reverse(),
            hoverinfo: 'text',
          };

          const barLayout = {
            title: `Top 10 OTUs for Sample ${selectedSample}`,
            xaxis: { title: 'Sample Values' },
            yaxis: { title: 'OTU IDs' }
          };

          Plotly.newPlot('bar', [barTrace], barLayout);

          // Update the bubble chart
          const bubbleTrace = {
            mode: 'markers',
            x: selectedData.otu_ids,
            y: selectedData.sample_values,
            text: selectedData.otu_labels,
            marker: {
              size: selectedData.sample_values,
              color: selectedData.otu_ids,
              colorscale: 'Viridis'
            }
          };

          const bubbleLayout = {
            title: `Bubble Chart for Sample ${selectedSample}`,
            xaxis: { title: 'OTU IDs' },
            yaxis: { title: 'Sample Values' }
          };

          Plotly.newPlot('bubble', [bubbleTrace], bubbleLayout);

          // Update sample metadata
          const metadataDiv = d3.select("#sampleMetadata");
          metadataDiv.html(""); // Clear previous content

          Object.entries(selectedMetadata).forEach(([key, value]) => {
            metadataDiv.append("p").text(`${key}: ${value}`);
          });
        } else {
          console.error(`No data found for sample ID: ${selectedSample}`);
        }
      }

      // Populate the dropdown menu with sample IDs
      const sampleIds = data.names;
      const dropdownMenu = d3.select("#selDataset");

      sampleIds.forEach(sampleId => {
        dropdownMenu.append("option").text(sampleId).property("value", sampleId);
      });

      // Initial call to update charts and sample metadata with the first sample ID
      updateCharts(sampleIds[0]);

      // Event listener for dropdown change
      dropdownMenu.on("change", function() {
        const selectedSample = this.value;
        updateCharts(selectedSample);
      });
    })
    .catch(function(error) {
      console.error("Error loading the JSON file:", error);
    });
});