<?xml version="1.0"?>
<!-- 
   File: svg-add-fun.xsl
   Author: Steve Eriksson - steve.eriksson@gmail.com
  -->
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:svg="http://www.w3.org/2000/svg"
  xmlns:xlink="http://www.w3.org/1999/xlink">


<!-- Set doc type and DTD -->
<xsl:output method="xml" encoding="utf-8" 
            doctype-system="http://www.w3.org/TR/SVG/DTD/svg10.dtd"
	    doctype-public="-//W3C//DTD SVG 1.0//EN" />


<xsl:template match="/svg:svg">

  <!-- Add reference to CSS stylesheets -->
  <xsl:processing-instruction name="xml-stylesheet">href="../styles/gui.css" type="text/css"</xsl:processing-instruction>

  <!-- Add script referenses to the document and add JavaScript hook to root node -->  
  <xsl:copy>
    <xsl:copy-of select="@*" /> <!-- Preserve all attributes -->
    <xsl:attribute name="onload">svg_onload(evt)</xsl:attribute> 
    <svg:script type="text/ecmascript" xlink:href="../script/base.js" />
    <svg:script type="text/ecmascript" xlink:href="../script/gui.js" />
    <svg:script type="text/ecmascript" xlink:href="../script/ext.js" />
    <xsl:apply-templates />
  </xsl:copy>
</xsl:template>

<!-- Identity transform http://www.w3.org/TR/xslt#copying -->
<xsl:template match="@*|node()">
  <xsl:copy>
    <xsl:apply-templates select="@*|node()"/>
  </xsl:copy>
</xsl:template>

<!-- Check SVG groups and add JavaScript hooks -->
<xsl:template match="svg:g">
  <xsl:copy>
    <xsl:if test="@class = 'node'">
      <xsl:attribute name="onclick">node_onclick(evt)</xsl:attribute>
      <xsl:attribute name="onmouseover">node_onmouseover(evt)</xsl:attribute>
      <xsl:attribute name="onmouseout">node_onmouseout(evt)</xsl:attribute>
    </xsl:if>
    <xsl:if test="@class = 'edge'">
      <xsl:attribute name="onclick">edge_onclick(evt)</xsl:attribute>
      <xsl:attribute name="onmouseover">edge_onmouseover(evt)</xsl:attribute>
      <xsl:attribute name="onmouseout">edge_onmouseout(evt)</xsl:attribute>
    </xsl:if>
    <xsl:apply-templates select="@*|node()" />
  </xsl:copy>
</xsl:template>

</xsl:stylesheet>
