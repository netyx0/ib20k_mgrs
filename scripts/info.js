function onclick_help()
{
	alert(
		"To change the map layer, click one of the buttons under the 'change map' section.\n"
		+ "\n"
		+ "\n"
		+ "To export the map to a pdf, click one of the buttons under the 'Export to PDF' section.\n"
		+ "\n"
		+ "The 'Scale to 1:20000' button exports A4 PDFs scaled to 1:20,000. A new menu will appear. This means you have entered '1:20k export mode'.\n"
		+ "> Clicking on the map will now display a red box. This red box shows the area covered by an A4 sheet of paper at 1:20000.\n"
		+ "> Clicking on the 'Export selection' button will export the area in the red box to a PDF file.\n"
		+ "> Alternatively, clicking the 'Export current view' button will export the area centered at the current view to a PDF file, again at 1:20000 scale.\n"
		+ "> The 'cancel' button exits out of 1:20k export mode.\n"
		+ "\n"
		+ "The 'At current scale' button exports A4 pdfs at the current viewing scale, centered at the current viewing area.\n"
		+ "\n"
		+ "\n"
		+ "It is also possible to view and export maps at a different orientation. You can change the orientation of the map with shift + alt + left mouse drag.\n"
		+ "Note that if exporting a 1:20k map from a selected area, rotating the map after making a selection may result in the exported map not aligning with the selection.\n"
		+ "\n"
		+ "\n"
		+ "Have fun! :D"
	)
}

function onclick_about()
{
	alert(
		"Last updated 20260205\n"
		+ "\n"
		+ "check out the poorly written code behind me here! https://github.com/netyx0/ib20k_mgrs\n"
		+ "\n"
		+ "contains code from jsPDF\n"
		+ "-> https://parall.ax/products/jspdf\n"
		+ "... and OpenLayers\n"
		+ "-> https://openlayers.org/\n"
		+ "... and Proj4js\n"
		+ "-> http://proj4js.org/\n"
		+ "\n"
		+ "Have fun! :D"
	)
}
