#!/usr/bin/perl

#
# File: showOpenTT.pl
#
# Author: Steve Eriksson - steve.eriksson@gmail.com
# 
# Test script that returns HTML to the client.
# This data can be generated based on database queries
#

use strict;
use warnings;
use CGI;
use DBI;

my $cgi = new CGI;
my  $hostname = $cgi->param( 'host' );

print $cgi->header();
print $cgi->start_html();
print $cgi->h1( "Open tickets for host: $hostname" );
print $cgi->ul( $cgi->li( 'TT1234' ), $cgi->li( 'TT3431' ), $cgi->li( 'TT9409' ) );
print $cgi->end_html();
