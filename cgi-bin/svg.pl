#!/usr/bin/perl
my $svg = q(<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg width="100" height="100"><circle cx="10" cy="10" r="10"/></svg>);
print "Content-Type: image/svg+xml", "\n\n";
print $svg;
