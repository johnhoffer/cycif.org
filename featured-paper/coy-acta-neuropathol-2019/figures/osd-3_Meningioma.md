---
title: Meningioma
layout: osd-exhibit
paper: config-coy-acta-neuropathol-2019
figure: 3_Meningioma
---
Exhibit:
  Name: Meningioma
  Images:
    - Name: i0
      Description: 'Meningioma - Coy S et al, 2019'
      Path: https://s3.amazonaws.com/www.cycif.org/coy-acta-neuropathologica-2019
      Width: 119908
      Height: 71838
      MaxLevel: 7
  Layout:
    Grid:
      - [i0]
  Groups:
    - Path: '467167'
      Name: HnE
      Colors:
        - 7F4AAD 
        - FF8080
      Channels:
        - Hematoxylin
        - Esoin
  Stories:
  - Name: Overview
    Description: 
    Waypoints:
    - Zoom: 0.4803
      Pan:
        - 0.845
        - 0.468
      Group: HnE
      Name: The Waypoint
      Description: |
        Image of Hematoxylin and Esoin (H&E) staining in a meningioma tissue biopsy.

        #### Figure from:

        Coy S et al, 2019 under review 

      Overlay:
        x: -100
        y: -100
        width: 200
        height: 200

  - Name: About
    Description: 
    Waypoints:
    - Name: Meningioma
      Group: HnE
      Description: NF2 patients frequently develop multiple meningiomas.
      Zoom: 0.4803
      Pan:
        - 0.845
        - 0.468
      Overlay:
        x: -100
        y: -100
        width: 200
        height: 200


    - Name: Fibroblastic Morphology
      Group: HnE
      Description: NF2-associated meningiomas often exhibit fibroblastic morphology. Note the elongated cells.
      Zoom: 8
      Pan:
        - 1.0757
        - 0.5657
      Overlay:
        x: 1.0481
        y: 0.5449
        width: 0.0594
        height: 0.0452

    - Name: Psammoma Bodies
      Group: HnE
      Description: Psammoma bodies, or round collections of calcium, can be observed in NF2 related meningiomas.
      Zoom: 16.02
      Pan:
        - 0.729
        - 0.615
      Overlay:
        x: 0.723
        y: 0.611
        width: 0.009
        height: 0.009




