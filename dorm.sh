
for file in * 
do
	if [[ $file =~ .*.";".* ]] 
	then
		rm -f "$file"
	fi
done
