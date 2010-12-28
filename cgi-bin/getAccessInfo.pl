#!/usr/bin/perl

#
# File: pingNode.pl
#
# Author: Steve Eriksson - steve.eriksson@gmail.com
# 
# CGI script that pings a node in the Telenor network.
#

use strict;
use warnings;
use Net::Ping;
use CGI;

my $cgi = new CGI;
my $hostname = $cgi->param( 'host' );
my $query1 =  "select CityName, Nation, Description, Access from database.table where SiteName = \"$hostname\"";
my $query  = "SELECT TiSiteName FROM database.table WHERE B2SiteName = \"STO30\"";
use DBI;
        my $DB=DBI->connect("DBI:mysql:database=database;host=localhost",
                                                                "user",
			    "pass",
			    { 'RaiseError' => 1}) || die "Error:".$DBI::errstr;

foreach(@{$DB->selectall_arrayref( $query )})
{
    #join(';',@_);
    print @$_;
    
}

