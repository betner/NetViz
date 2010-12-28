#!/usr/bin/perl

#
# File: getHWInfo.pl
#
# Author: Steve Eriksson - steve.eriksson@gmail.com
# 
# CGI script that collects information regarding a nodes hardware and function
#

use strict;
use warnings;
use CGI;
use DBI;

my $cgi = new CGI;
my $hostname = $cgi->param( 'host' );

my $DB=DBI->connect("DBI:mysql:database=database;host=localhost",
		    "user",
		    "pass",
		    { 'RaiseError' => 1}) || die "Error:".$DBI::errstr;


my $statement = $DB->prepare("SELECT HardWareType, FunctionType, ChassiModel from database.table WHERE name = \"$hostname\";");

$statement->execute || print( "Database error: ", $DB->errstr );

my ($hardware, $function, $chassi) = $statement->fetchrow_array;

print "Hardware type: $hardware, Network function: $function, Model: $chassi";

